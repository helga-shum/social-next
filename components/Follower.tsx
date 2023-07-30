import Link from "next/link";

const Follower: React.FC<{
  name: string;
  picturePath: string;
  userId: string;
}> = ({ name, picturePath, userId }) => {
  return (
    <Link href={`/profiles/${userId}`}>
      <li className="flex items-center mb-[15px]">
        <img
          className="w-8 h-8 object-cover mr-2.5 rounded-[50%]"
          src={`http://localhost:3000/assets/${picturePath}`}
          alt=""
        />
        <span className="sidebarFriendName">{name}</span>
      </li>
    </Link>
  );
};

export default Follower;
