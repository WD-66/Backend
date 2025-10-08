import { Link } from 'react-router';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { useAuth } from '@/context';

type PostCardProps = {
	_id: string;
	content: string;
	image: string;
	title: string;
	author: string;
	setPosts: SetPosts;
};

// pass author via props, along with posts setter so we can update UI
const PostCard = ({
	_id,
	content,
	image,
	title,
	author,
	setPosts
}: PostCardProps) => {
	// consume user state from Auth Context
	const { user } = useAuth();
	return (
		<div className='card bg-base-100 shadow-xl'>
			<figure className='bg-white h-48'>
				<img src={image} alt={title} className='object-cover h-full w-full' />
			</figure>
			<div className='card-body h-56'>
				<h2 className='card-title'>{title}</h2>
				<p className='truncate text-wrap'>{content}</p>
				<Link to={`/post/${_id}`} className='btn btn-primary mt-4'>
					Read More
				</Link>
				{/* conditionally render to only show buttons if signed in user's _id matches the author of th post */}
				{user?._id === author && (
					<div className='card-actions justify-center gap-6'>
						<button
							onClick={() =>
								document
									.querySelector<HTMLDialogElement>(`#edit-modal-${_id}`)!
									.showModal()
							}
							className='btn btn-success'
						>
							Edit
						</button>
						{/* pass all needed info for updating a post as props, and setter to update posts state */}
						<EditModal
							_id={_id}
							content={content}
							image={image}
							author={author}
							title={title}
							setPosts={setPosts}
						/>

						<button
							onClick={() =>
								document
									.querySelector<HTMLDialogElement>(`#delete-modal-${_id}`)!
									.showModal()
							}
							className='btn btn-error'
						>
							Delete
						</button>
						{/* pass setter to update posts state */}
						<DeleteModal _id={_id} setPosts={setPosts} />
					</div>
				)}
			</div>
		</div>
	);
};

export default PostCard;
