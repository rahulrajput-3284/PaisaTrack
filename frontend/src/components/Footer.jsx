import { Wallet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__brand">
        <Wallet size={13} /> PaisaTrack
      </span>
      <span>Built with React, Node, Express &amp; MongoDB</span>
    </footer>
  );
}
