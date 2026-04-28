import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Download, Share2, AlertCircle, ShieldCheck } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useTripContext } from '../context/TripContext';
import { createTripBooking } from '../lib/api';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';

const Confirmation = () => {
  const navigate = useNavigate();
  const { tripData, calculateTotalCost, user, setActiveBookingId } = useTripContext();

  const [bookingId, setBookingId] = useState('Pending...');
  const [bookingError, setBookingError] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);
  const hasBookedRef = useRef(false);

  const totalPrice = calculateTotalCost();

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Helper Functions ---
  const syncBooking = async () => {
    if (!user) {
      setBookingError("Please login to save your booking.");
      setBookingId("Unauthorized");
      setIsSyncing(false);
      return null;
    }

    setIsSyncing(true);
    setBookingError('');

    try {
      const response = await createTripBooking({
        userId: user.id,
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        travelers: tripData.travelers,
        totalPrice,
        status: 'PENDING'
      });
      const finalId = `VOYEX${response.bookingId}`;
      setBookingId(finalId);
      if (setActiveBookingId) setActiveBookingId(finalId);
      return finalId;
    } catch (error: any) {
      setBookingError(error.message || 'Connection to server failed.');
      setBookingId('Not Created');
      return null;
    } finally {
      setIsSyncing(false);
    }
  };

  const downloadTicketPDF = () => {
    if (bookingId === 'Pending...' || bookingId === 'Not Created') {
      alert("Please wait for the booking to be confirmed before downloading.");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 245, 255);
    doc.text("VOYEX TRAVEL TICKET", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Booking ID: ${bookingId}`, 20, 40);
    doc.text(`Passenger: ${user?.fullName || 'Guest'}`, 20, 50);
    doc.text(`Destination: ${tripData.destination}`, 20, 60);
    doc.text(`Dates: ${tripData.startDate} to ${tripData.endDate}`, 20, 70);
    doc.text(`Travelers: ${tripData.travelers}`, 20, 80);
    doc.text(`Total Price: INR ${totalPrice.toLocaleString()}`, 20, 90);
    doc.line(20, 100, 190, 100);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Present this digital or printed ticket at the departure point.", 20, 110);
    doc.text("Thank you for choosing Voyex!", 20, 120);
    doc.save(`Voyex_Ticket_${bookingId}.pdf`);
  };

  const drawTicketCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#00F5FF";
    ctx.font = "bold 24px Arial";
    ctx.fillText("VOYEX TRAVEL TICKET", 40, 50);

    // Trip details
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText(`Booking ID: ${bookingId}`, 40, 100);
    ctx.fillText(`Passenger: ${user?.fullName || "Guest"}`, 40, 130);
    ctx.fillText(`Destination: ${tripData.destination}`, 40, 160);
    ctx.fillText(`Dates: ${tripData.startDate} to ${tripData.endDate}`, 40, 190);
    ctx.fillText(`Travelers: ${tripData.travelers}`, 40, 220);
    ctx.fillText(`Total Price: ₹${totalPrice.toLocaleString()}`, 40, 250);

    // Footer
    ctx.fillStyle = "#888";
    ctx.font = "12px Arial";
    ctx.fillText("Thank you for choosing VOYEX!", 40, 300);
  };

  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `Voyex_Ticket_${bookingId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareItinerary = async () => {
    const shareData = {
      title: 'My Voyex Trip',
      text: `I'm heading to ${tripData.destination} with Voyex! Journey starts on ${tripData.startDate}.`,
      url: window.location.origin
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} Check it out here: ${shareData.url}`);
        alert("Itinerary details copied to clipboard!");
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  // --- Effects ---
  useEffect(() => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#00F5FF', '#7000FF', '#ffffff'] });
  }, []);

  useEffect(() => {
    if (hasBookedRef.current) return;
    if (tripData.destination && tripData.startDate) {
      hasBookedRef.current = true;
      syncBooking();
    }
  }, [totalPrice, tripData, user, setActiveBookingId]);

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2 font-syne">Trip Reserved!</h1>
          <p className="text-gray-400">Your journey to {tripData.destination} is being prepared.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase">Booking ID</p>
                  <h2 className="text-2xl font-bold text-brand-cyan">{bookingId}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 uppercase">Total Price</p>
                  <h2 className="text-2xl font-bold text-white">₹{totalPrice.toLocaleString()}</h2>
                </div>
              </div>

              {bookingError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 mb-6 flex items-center gap-2">
                  <AlertCircle size={18} /> {bookingError}
                </div>
              )}

              <div className="mb-8">
                <canvas ref={canvasRef} width={600} height={350} className="border border-white/10 rounded-lg w-full bg-slate-900" />
                <div className="flex gap-4 mt-4">
                  <button onClick={drawTicketCanvas} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all border border-white/10">
                    Preview Ticket
                  </button>
                  <button onClick={downloadCanvasImage} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all border border-white/10">
                    Download Image
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-4">
            <button
              onClick={async () => {
                if (bookingId === 'Unauthorized') {
                  navigate('/login');
                  return;
                }

                const finalBookingId =
                  bookingId !== 'Not Created' && bookingId !== 'Pending...'
                    ? bookingId
                    : await syncBooking();

                if (finalBookingId) {
                  navigate('/payment', { state: { bookingId: finalBookingId } });
                }
              }}
              disabled={isSyncing}
              className="w-full py-4 bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" /> Proceed to Payment
            </button>
            {bookingError && (
              <button
                onClick={syncBooking}
                disabled={isSyncing || bookingId === 'Unauthorized'}
                className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Retry Booking Sync
              </button>
            )}
            <button onClick={downloadTicketPDF} className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={shareItinerary} className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <Share2 className="w-4 h-4" /> Share Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;