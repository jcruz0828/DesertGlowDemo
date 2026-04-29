import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import About from "@/components/About";
import ServicesList from "@/components/ServicesList";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AppointmentCalendar from "@/components/AppointmentCalendar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesGrid />
        <About />
        <ServicesList />
        <Testimonials />
        <AppointmentCalendar/>  
        {/*<BookNow />*/}
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}
