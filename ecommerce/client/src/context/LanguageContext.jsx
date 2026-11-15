import { createContext, useContext, useEffect, useState } from "react";

const dict = {
  en: {
    home: "Home",
    products: "Products",
    orders: "Orders",
    dashboard: "Dashboard",
    login: "Login",
    hello: "Hello",
    heroA: "Quality products, delivered to your",
    heroB: "doorstep",
    heroSub: "Shop electronics, fashion, home essentials and sports gear at honest prices.",
    shopNow: "Shop Now",
    createAccount: "Create Account",
    statProducts: "Products",
    statCategories: "Categories",
    statSecure: "Secure",
    perk1: "Free Delivery",
    perk1t: "On orders above ₹999",
    perk2: "Secure Payment",
    perk2t: "100% safe checkout",
    perk3: "Easy Returns",
    perk3t: "7 days return policy",
    perk4: "24/7 Support",
    perk4t: "Here to help you",
    shopByCategory: "Shop by Category",
    featured: "Featured Products",
    viewAll: "View all",
    electronics: "Electronics",
    fashion: "Fashion",
    homeCat: "Home",
    sports: "Sports",
  },
  ta: {
    home: "முகப்பு",
    products: "பொருட்கள்",
    orders: "ஆர்டர்கள்",
    dashboard: "டாஷ்போர்டு",
    login: "உள்நுழை",
    hello: "வணக்கம்",
    heroA: "தரமான பொருட்கள், உங்கள்",
    heroB: "வாசலுக்கே",
    heroSub: "எலக்ட்రானிக்ஸ், ஃபேஷன், வீட்டு உபயோகப் பொருட்கள் மற்றும் விளையாட்டு சாதனங்கள் நியாயமான விலையில்.",
    shopNow: "இப்போது வாங்க",
    createAccount: "கணக்கு உருவாக்கு",
    statProducts: "பொருட்கள்",
    statCategories: "வகைகள்",
    statSecure: "பாதுகாப்பு",
    perk1: "இலவச டெலிவரி",
    perk1t: "₹999-க்கு மேல் ஆர்டர்களுக்கு",
    perk2: "பாதுகாப்பான பணம்",
    perk2t: "100% பாதுகாப்பான செக்அவுட்",
    perk3: "எளிய திரும்பப்பெறல்",
    perk3t: "7 நாள் திரும்பப்பெறும் கொள்கை",
    perk4: "24/7 உதவி",
    perk4t: "உங்களுக்கு உதவ தயார்",
    shopByCategory: "வகை வாரியாக வாங்குங்கள்",
    featured: "சிறப்புப் பொருட்கள்",
    viewAll: "அனைத்தும் பார்",
    electronics: "மின்னணு",
    fashion: "ஆடைகள்",
    homeCat: "இல்லம்",
    sports: "விளையாட்டு",
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => dict[lang][key] || dict.en[key] || key;
  const toggleLang = () => setLang(lang === "en" ? "ta" : "en");

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);