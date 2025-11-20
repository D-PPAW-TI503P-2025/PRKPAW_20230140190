
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!token) return null;

    const user = jwtDecode(token);
    const isAdmin = user.role === 'admin';

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div>Selamat datang, {user.nama}</div>
            <div>
                {isAdmin && (
                    <button
                        onClick={() => navigate('/reports')}
                        className="mr-4 hover:underline"
                    >
                        Laporan Admin
                    </button>
                )}
                <button onClick={handleLogout} className="hover:underline">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;