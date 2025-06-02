import { Grid, Box } from "@mui/material";
import Stream from "@/components/stream/stream";
import Inventory from "@/components/inventory/inventory";
import Index from "@/components/index/index";

export default function Home() {
  return (
    <Grid>
      <Stream />
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
      }}>
        <Inventory />
        <Index />
      </Box>
    </Grid>
  );
}
