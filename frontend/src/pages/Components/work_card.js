import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const WorkCard = ({ title, description, image,url }) => {
  const theme = useTheme();

  const handleCardClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        maxHeight: 355,
        backgroundColor: theme.palette.background.paper,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 6,
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default WorkCard;
