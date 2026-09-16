import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Montserrat } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AosProvider from "@/Provider/AosProvider/AosProvider";
import AuthProvider from "@/Provider/AuthProvider/AuthProvider";
import QueryProvider from "@/Provider/QueryProvider/QueryProvider";
import GoogleTranslateLoader from "@/Components/GoogleTranslateLoader";
import { SocketProvider } from "@/Provider/SocketProvider/SocketProvider";

// Fonts
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "TerraLink - Real Estate Marketplace in Honduras",
    template: "%s | TerraLink",
  },
  description:
    "TerraLink is the leading real estate marketplace in Honduras. Explore top-tier homes, apartments, land, and commercial properties for sale and rent.",
  icons: {
    icon: "/fav.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <GoogleTranslateLoader />
        <GoogleOAuthProvider clientId="121983602661-qbkvthsu98io905c79d4sneacagq12rd.apps.googleusercontent.com">
          <QueryProvider>
            <AuthProvider>
              <AosProvider>
                <Toaster />
                <SocketProvider>{children}</SocketProvider>
              </AosProvider>
            </AuthProvider>
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
