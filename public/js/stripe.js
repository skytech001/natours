const stripe = Stripe(
  "pk_test_51MhMYoClHMJyb9StATe74Nn5SrpmTUjYt4hNVO4rPYMUvT7AdGjF9dPuLTshOCZ0FkqMmuSF7z2mEQlxEar1N8Jf000NKu7HaP"
);

const bookTour = async (tourId) => {
  const Id = tourId.tourId;
  try {
    //get session from api
    const session = await axios.get(`/api/v1/bookings/checkout-session/${Id}`);

    //create checkout form & charge card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};

const bookBtn = document.getElementById("book-tour");

if (bookBtn)
  bookBtn.addEventListener("click", async (e) => {
    e.target.textContent = "Processing...";
    const tourId = e.target.dataset;
    await bookTour(tourId);
    e.target.textContent = "Book tour now!";
  });
