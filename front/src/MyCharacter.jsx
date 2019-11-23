import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Axios from "axios";

// import { Stuff } from "../../database";

function MyCharacter() {
  const [cookies, setCookie, removeCookie] = useCookies();
  //   console.log(Stuff)
  const [myCharacter, setMyCharacter] = useState(false);
  if (!myCharacter) {
    Axios.post("/api/decodeToken", { token: cookies.token }).then(
      ({ data }) => {
        console.log(data);
        setMyCharacter(data);
      }
    );
  }
  const Stuff = myCharacter
    ? myCharacter.stuff.map(piece => {
        console.log(piece.type);
        return <a href="#" data-wowhead={`item=${piece.item}`} ><div className={piece.type}>{piece.item}</div></a>;
      })
    : false;
  return (
    <div id="MyCharacter" className={myCharacter.classe}>
      <div className="name">
        <div className={`icon ${myCharacter.classe}`}></div>
        <div className="text">{myCharacter.name}</div>
      </div>

      <div className="spe">{myCharacter.spe}</div>
      <div className="stuff">{Stuff}</div>
      <div className="wishlist">WishList</div>
      <a href="#" data-wowhead="item=18490">hai</a>
    </div>
  );
}

export default MyCharacter;
