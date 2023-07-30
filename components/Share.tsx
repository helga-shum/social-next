import { PostItem } from "@/types";
import { PermMedia, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import Dropzone from "react-dropzone";

interface ShareProps {
  photo: string;
  name: string;
  getProfilePosts: () => Promise<PostItem[]>;
}

const Share: React.FC<ShareProps> = ({ photo, name, getProfilePosts }) => {
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState<any>({});
  const [post, setPost] = useState("");
  const handlePost = async () => {
    setImage({});
    setPost("");
    await axios.post("/api/posts/addPost", {
      description: post,
      picturePath: image?.name,
    });
    getProfilePosts();
  };
  return (
    <div className="w-full h-[170px] shadow-[0px_0px_16px_-8px_rgba(0,0,0,0.68)] rounded-[10px]">
      <div className="p-2.5">
        <div className="flex items-center">
          <img
            className="w-[50px] h-[50px] object-cover mr-2.5 rounded-[50%]"
            src={`http://localhost:3000/assets/${photo}`}
            alt=""
          />
          <input
            onChange={(e) => setPost(e.target.value)}
            value={post}
            placeholder={`What's in your mind ${name} ?`}
            className="w-4/5 border-[none]"
          />
        </div>
        <hr className="m-5" />
        <div className=" flex items-center justify-between">
          <div className="flex ml-5">
            {isImage && (
              <Box border={`1px solid`} borderRadius="5px" mt="1rem" p="1rem">
                <Dropzone
                  // @ts-ignore
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <>
                      <Box
                        {...getRootProps()}
                        p="1rem"
                        width="100%"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!image ? (
                          <p>Add Image Here</p>
                        ) : (
                          <>
                            <Typography>{image.name}</Typography>
                            <EditOutlined />
                          </>
                        )}
                      </Box>
                      {image && (
                        <IconButton
                          onClick={() => setImage(null)}
                          sx={{ width: "15%" }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </>
                  )}
                </Dropzone>
              </Box>
            )}
            <div className="flex items-center cursor-pointer mr-[15px]">
              <PermMedia
                htmlColor="tomato"
                className="text-lg mr-[3px]"
                onClick={() => setIsImage(!isImage)}
              />
              <span className="text-sm font-medium">Photo or Video</span>
            </div>
          </div>
          <button
            className=" bg-[green] font-medium cursor-pointer text-[white] mr-5 p-[7px] rounded-[5px] border-[none]"
            disabled={!post}
            onClick={handlePost}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default Share;
