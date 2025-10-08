import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context';

const ProtectedLayout = () => {
	// get signedIn from out auth context
	const { signedIn } = useAuth();

	// if signedIn is true. return outlet (show the page)
	if (signedIn) {
		return <Outlet />;
		// else navigate to login page
	} else {
		return <Navigate to='/login' />;
	}
};

export default ProtectedLayout;
