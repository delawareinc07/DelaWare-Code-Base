import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display font-bold mb-4">Pabblyn</h3>
            <p className="text-sm text-gray-300 mb-4">
              Forging Purpose-Driven Leaders for the Metropolitan World
            </p>
            <p className="text-xs text-gray-400">
              Mbeirebe Akpawat, Ibesikpo Asuthan LGA, Akwa Ibom State, Nigeria
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-brand-gold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/programmes" className="text-gray-300 hover:text-brand-gold transition">
                  Programmes
                </Link>
              </li>
              <li>
                <Link to="/learning-community" className="text-gray-300 hover:text-brand-gold transition">
                  Learning Community
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-brand-gold transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-brand-gold transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-brand-gold">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/student" className="text-gray-300 hover:text-brand-gold transition">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/teacher" className="text-gray-300 hover:text-brand-gold transition">
                  Teacher Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-brand-gold transition">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-brand-gold">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://wa.me/09028877816" className="text-gray-300 hover:text-brand-gold transition">
                  WhatsApp: 09028877816
                </a>
              </li>
              <li>
                <a href="mailto:admissions@pabblyncollege.edu" className="text-gray-300 hover:text-brand-gold transition">
                  Email: admissions@pabblyncollege.edu
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} Pabblyn Metropolitan College. All rights reserved.
          </p>
          <p className="text-center text-xs text-gray-500 mt-2">
            Built by DelaWare Inc BAAS System
          </p>
        </div>
      </div>
    </footer>
  )
}
