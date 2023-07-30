import { CommentItem } from "@/types";
import { Avatar, Grid, Paper } from "@mui/material";

const Comment: React.FC<{ comment: CommentItem }> = ({ comment }) => {
  return (
    <div className="comment">
      <Paper style={{ padding: "40px 20px" }}>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid>
            <Avatar
              alt="Remy Sharp"
              src={`http://localhost:3000/assets/${comment.user.picturePath}`}
            />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4
              style={{ margin: 0, textAlign: "left" }}
            >{`${comment.user.firstName} ${comment.user.lastName}`}</h4>

            <p style={{ textAlign: "left" }}>{comment.text}</p>
            <p style={{ textAlign: "left", color: "gray" }}>
              {comment.createdAt.toString()}
            </p>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Comment;
