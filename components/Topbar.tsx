import React from "react";
import Link from "next/link";

interface TopbarProps {
  avatar: string;
  userId: string;
}

const Topbar: React.FC<TopbarProps> = ({ avatar, userId }) => {
  return (
    <div className="h-[50px] w-full bg-[#1877f2] flex items-center sticky z-[999] top-0">
      <div className="flex-[3]">
        <span className="text-2xl font-[bold] text-[white] cursor-pointer ml-5">
          Lovesocial
        </span>
      </div>

      <div className="flex-[4] flex items-center justify-around text-[white]">
        <Link href={`/profiles/${userId}`}>
          <div className="flex justify-between">
            <div className="mr-5">My Profile</div>
            <img
              src={`http://localhost:3000/assets/${avatar}`}
              alt=""
              className="w-8 h-8 object-cover cursor-pointer rounded-[50%]"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
