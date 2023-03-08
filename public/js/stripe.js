import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51MhMYoClHMJyb9StATe74Nn5SrpmTUjYt4hNVO4rPYMUvT7AdGjF9dPuLTshOCZ0FkqMmuSF7z2mEQlxEar1N8Jf000NKu7HaP"
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
