import { PrivateRoute } from "@/pages/private";
import { PublicRoute } from "@/pages/public";
import { TransitionGroup } from "react-transition-group";

function Routers() {
  return (
    <TransitionGroup style={{ width: "100%", height: "100%" }}>
      <PublicRoute />
      <PrivateRoute />
    </TransitionGroup>
  );
}

export default Routers;
