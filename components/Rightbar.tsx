import { User } from "@/types";
import CloseFriend from "./CloseFriends";
import Follower from "./Follower";

interface RightbarProps {
  profile?: boolean;
  location?: string;
  occupation?: string;
  arrFriends: User[];
  users: User[];
}
const Rightbar: React.FC<RightbarProps> = ({
  profile,
  location,
  occupation,
  arrFriends,
  users,
}) => {
  const HomeRightbar = () => {
    return (
      <>
        <div className="flex items-center">
          <img className="w-10 h-10 mr-2.5" src="assets/gift.png" alt="" />
          <span className="font-light text-[15px]">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img
          className="w-full mx-0 my-[30px] rounded-[10px]"
          src="assets/ad.png"
          alt=""
        />
        <div>
          <h4 className="mb-5 text-lg font-medium mb-2.5">Your followers</h4>
          {arrFriends.length == 0 ? (
            <div>You have no followers</div>
          ) : (
            <ul className="m-0 p-0 list-none">
              {arrFriends.map((friend: User) => (
                <Follower
                  key={friend.id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  picturePath={friend.picturePath || ""}
                  userId={friend.id}
                />
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="mb-5 text-lg font-medium my-2.5">
            Maybe you know these people
          </h4>
          {users.length == 0 ? (
            <div>You have no offers</div>
          ) : (
            <ul className="m-0 p-0 list-none">
              {users.map((user: User) => (
                <Follower
                  key={user.id}
                  name={`${user.firstName} ${user.lastName}`}
                  picturePath={user.picturePath as string}
                  userId={user.id}
                />
              ))}
            </ul>
          )}
        </div>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        <h4 className="mb-5 text-lg font-medium mb-2.5">User information</h4>
        <div className="mb-[30px]">
          <div className="mb-2.5">
            <span className="font-medium text-[#555] mr-[15px]">Location:</span>
            <span className="font-light">{location}</span>
          </div>
          <div className="mb-2.5">
            <span className="font-medium text-[#555] mr-[15px]">
              Occupation:
            </span>
            <span className="font-light">{occupation}</span>
          </div>
        </div>
        <h4 className="mb-5 text-lg font-medium mb-2.5">User friends</h4>
        {arrFriends.length == 0 ? (
          <div>Empty</div>
        ) : (
          <div className="flex flex-wrap justify-between">
            {arrFriends.map((friend: User) => (
              <CloseFriend
                key={friend.id}
                name={`${friend.firstName} ${friend.lastName}`}
                picturePath={friend.picturePath || ""}
                userId={friend.id}
              />
            ))}
          </div>
        )}
      </>
    );
  };
  return (
    <div className="flex-[3.5]">
      <div className="pl-0 pr-5 pt-5 pb-0">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;
