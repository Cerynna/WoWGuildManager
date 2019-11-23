import React, { useRef, useState } from "react";
import axios from "axios";

function Login() {
  const pass = useRef();
  const passBis = useRef();
  const login = useRef();
  const [page, setPage] = useState(true);
  function annimInput(element, duration) {
    element.style.border = "2px solid red";
    element.style.background = "rgb(255, 140, 140)";
    setTimeout(() => {
      element.style.border = "2px solid rgb(119, 119, 119)";
      element.style.background = "rgb(255, 140, 140)";
    }, duration);
  }

  function verifInscript(login, pass, passBis) {
    if (login.length < 1) {
      return {
        err: {
          type: "login",
          mess: "Le login doit faire plus de 1 caractère."
        }
      };
    }
    if (pass.length < 5) {
      return {
        err: {
          type: "pass",
          mess: "Le password doit faire plus de 5 caractères."
        }
      };
    }
    if (pass !== passBis) {
      return {
        err: {
          type: "passBis",
          mess: "Les deux password ne coresponde pas."
        }
      };
    }
    return {
      stat: true
    };
  }
  if (page) {
    return (
      <div className="Login">
        <div className="title">Connection</div>
        <label htmlFor="login">Login :</label>
        <input type="text" name="login" id="login" ref={login} />
        <label htmlFor="pass">Password :</label>
        <input type="password" name="pass" id="pass" ref={pass} />
        <div
          className="btn"
          onClick={() => {
            axios
              .post("/auth/login", {
                login: login.current.value,
                pass: pass.current.value
              })
              .then(({ data }) => {
                if (!data.err) {
                  // removeCookie("token");
                  window.location.reload();
                } else {
                  switch (data.err.type) {
                    case "pass":
                      annimInput(pass.current, 3000);
                      break;
                    case "login":
                      annimInput(login.current, 3000);
                      break;
                    default:
                      annimInput(pass.current, 3000);
                      annimInput(login.current, 3000);
                      break;
                  }
                }
              });
          }}
        >
          Valider
        </div>
        <div
          className="register"
          onClick={() => {
            setPage(!page);
          }}
        >
          Inscription
        </div>
      </div>
    );
  } else {
    return (
      <div className="Login">
        <div className="title">Inscription</div>
        <label htmlFor="login">Pseudo :</label>
        <input type="text" name="login" id="login" ref={login} />
        <label htmlFor="pass">Password :</label>
        <input type="password" name="pass" id="pass" ref={pass} />
        <label htmlFor="pass">Password x2 :</label>
        <input type="password" name="passBis" id="passBis" ref={passBis} />
        <div
          className="btn"
          onClick={() => {
            const verif = verifInscript(
              login.current.value,
              pass.current.value,
              passBis.current.value
            );
            if (verif.err) {
              switch (verif.err.type) {
                case "pass":
                  annimInput(pass.current, 3000);
                  break;
                case "passBis":
                  annimInput(passBis.current, 3000);
                  break;
                case "login":
                  annimInput(login.current, 3000);
                  break;
                default:
                  annimInput(login.current, 3000);
                  annimInput(passBis.current, 3000);
                  annimInput(pass.current, 3000);
                  break;
              }
            } else {
              axios
                .post("/auth/register", {
                  login: login.current.value,
                  pass: pass.current.value
                })
                .then(({ data }) => {
                    console.log(data)
                  if (data.err) {
                    annimInput(login.current, 3000);
                  } else {
                    setPage(!page)
                    window.location.reload();
                  }
                });
            }
          }}
        >
          Valider
        </div>
        <div
          className="register"
          onClick={() => {
            setPage(!page);
          }}
        >
          Connection
        </div>
      </div>
    );
  }
}

export default Login;
