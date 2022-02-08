import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Container from '@mui/material/Container';

export default function SongsDetailPage () {
    let params = useParams();
    const id = parseInt(params.id);
    console.log(params.id)
    const theme = useTheme();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    const getData = async() => {
        try {
            const response = await fetch(`https://api.discogs.com/releases/${id}`, {
            }
            );

            if(!response.ok) {
                if(response.status === 404) {
                    throw new Error ('404 not found')
                } else throw new Error (`This is an HTTP error: The status is ${response.status}`);
            }

            let actualData = await response.json();
            setData(actualData);
            setError(null);
        } catch(err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    console.log(data);

    return (

        <>
            {loading && <div>A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the post - ${error}`} </div>
            )}

            {!error && !loading && data && (
                    <Card sx={{ display: 'flex'}} >
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {data.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {data.artist}
                            </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                            <IconButton aria-label="previous">
                                {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                            </IconButton>
                            <IconButton aria-label="play/pause">
                                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                            </IconButton>
                            <IconButton aria-label="next">
                                {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                            </IconButton>
                            </Box>
                        </Box>
                        <CardMedia
                            component="img"
                            sx={{ width: 151 }}
                            image="/static/images/cards/live-from-space.jpg"
                            alt="Live from space album cover"
                        />
                    </Card>
                // </Container>
            )}
        </>
    );
}