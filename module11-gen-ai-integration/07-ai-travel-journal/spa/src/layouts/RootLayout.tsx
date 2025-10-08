import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { Navbar, ChatBtn } from '@/components';
import { AuthProvider } from '@/context';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = () => {
	return (
		<AuthProvider>
			<div className='container mx-auto'>
				<ToastContainer
					position='bottom-left'
					autoClose={1500}
					theme='colored'
				/>
				<Navbar />
				<Outlet />
				<ChatBtn />
			</div>
		</AuthProvider>
	);
};

export default RootLayout;
