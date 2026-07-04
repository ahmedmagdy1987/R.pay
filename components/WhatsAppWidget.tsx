"use client";

export default function WhatsAppWidget({ phone }: { phone: string }) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(
    "مرحبًا، أرغب في معرفة المزيد عن R Pay"
  )}`;
  return (
    <div className="wa">
      <span className="wa-tip">
        <span className="ar-t">تواصل معنا على واتساب</span>
        <span className="en-t">Chat with us on WhatsApp</span>
      </span>
      <a
        className="wa-btn"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.15-1.7-.84-2-.94-.26-.1-.46-.15-.65.15-.2.28-.75.94-.92 1.13-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.28-.02-.44.13-.58.13-.13.3-.34.44-.5.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.65-1.57-.9-2.15-.24-.56-.48-.48-.65-.49l-.56-.01c-.2 0-.5.07-.77.36-.26.28-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.15.2 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.2-.55-.34zM12 2a10 10 0 0 0-8.6 15.05L2 22l5.05-1.32A10 10 0 1 0 12 2zm0 18.2c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3 .78.8-2.92-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
        </svg>
      </a>
    </div>
  );
}
