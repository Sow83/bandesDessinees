import { Link } from 'react-router-dom';
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
    <nav className="footer__nav container" aria-label="navigation pieds de page">
            <div className="footer__item">
                <Link to={'/'} className="text-decoration-none fw-bold footer__logo">BandesDessinées</Link>
                <ul className="list-unstyled footer__social-links">
                    <li className='list-item'><a href="https://www.facebook.com/" target="_blank" className="footer__social-link" title="facebook" rel="noreferrer"><span className="fab fa-facebook-f" title="facebook"></span></a></li>
                    <li><a href="https://www.linkedin.com/" target="_blank" className="footer__social-link" title="linkedin" rel="noreferrer"><span className="fab fa-linkedin-in" title="linkedin"></span></a></li>
                    <li><a href="https://www.pinterest.fr/" target="_blank" className="footer__social-link" title="pinterest" rel="noreferrer"><span className="fab fa-pinterest-p" title="pinterest"></span></a></li>
                    <li><a href="https://www.twitter.com/" target="_blank" className="footer__social-link" title="twitter" rel="noreferrer"><span className="fab fa-twitter" title="twitter"></span></a></li>
                </ul>
                <p>Nous acceptons ces cartes de paiement</p>
                <img src="http://localhost:8000/images/credit-card.png" alt="" />
            </div>

            <div className="footer__item">
                <h5 className="footer__title">Navigation</h5>
                <ul className='list-unstyled'>
                    <li><Link to={'/'} className="text-decoration-none d-block footer__link">Accueil</Link></li>
                    <li><Link to={'/'} className="text-decoration-none d-block footer__link" href="nous-connaitre.html">Nous Connaitre</Link></li>
                    <li><Link to={'/'} className="text-decoration-none d-block footer__link" href="proprietes.html">Propriétés</Link></li>
                    <li><Link to={'/'} className="text-decoration-none d-block footer__link" href="contacts.html">Contacts</Link></li>
                </ul>
            </div>

            <div className="footer__item">
                <h5 className="footer__title">Pour les clients</h5>
                <ul className='list-unstyled'>
                    <li><Link to={'/'} className="text-decoration-none d-block footer__link">Blog</Link></li>
                    <li><Link to={'/'} className="text-decoration-none d-block footer__link">Forum</Link></li>
                    <li><Link to={'/'} className="text-decoration-none d-block footer__link">Promotions</Link></li>
                    <li><Link to={'/'} className="text-decoration-none d-block footer__link">Informations</Link></li>
                </ul>
            </div>

            <div className="footer__item">
                <h5 className="footer__title">Nous contacter</h5>
                <address>
                    <p>15 Square Vergennes,<br />75015 Paris</p>
                    <p>Téléphone: <a className="footer__contact" href="tel:(+33)0122735925">(+33) 1 22 73 59 25</a><br />Fax: (+33) 1 22 73 59 25</p>
                    <p> Mail: <a className="footer__contact" href="mailto:fontenay@immobilier.com">bdcontact@gmail.com</a></p>
                </address>
            </div>
    </nav>
    <p className="footer__copyright">2023, <a className="footer__copyright-link" href="https://mouhamadousow.fr/">Mouhamadou Sow</a></p>
</footer>
  )
}

export default Footer;
