/**
 * Footer component for the application
 */

import { colorBorder, colorPrimary, colorText } from "@pokemmo/styles/variables";
import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer css={{
      borderTop: `1px solid ${colorBorder.string()}`,
      padding: "24px 0",
      marginTop: 60,
      textAlign: "center",
      fontSize: 14,
      color: colorText.fade(0.4).toString(),
    }}>
      <div css={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 20px",
      }}>
        <div css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          "@media (min-width: 768px)": {
            flexDirection: "row",
            justifyContent: "space-between",
          }
        }}>
          <div>
            <p css={{ margin: 0 }}>
              © {currentYear} PokeMMO Daycare Mastermind. All rights reserved.
            </p>
          </div>
          
          <nav>
            <ul css={{
              display: "flex",
              gap: 24,
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}>
              <li>
                <Link to="/" css={{
                  color: colorText.fade(0.4).toString(),
                  textDecoration: "none",
                  "&:hover": {
                    color: colorPrimary.string(),
                  }
                }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" css={{
                  color: colorText.fade(0.4).toString(),
                  textDecoration: "none",
                  "&:hover": {
                    color: colorPrimary.string(),
                  }
                }}>
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/pokemon" css={{
                  color: colorText.fade(0.4).toString(),
                  textDecoration: "none",
                  "&:hover": {
                    color: colorPrimary.string(),
                  }
                }}>
                  Pokémon
                </Link>
              </li>
              <li>
                <Link to="/help" css={{
                  color: colorText.fade(0.4).toString(),
                  textDecoration: "none",
                  "&:hover": {
                    color: colorPrimary.string(),
                  }
                }}>
                  Help
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}