import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

const App = () => {
  const [activeHeader, setActiveHeader] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setActiveHeader(location.pathname != "/blackjack");
  }, [location]);

  return (
    <Box>
      <VStack display={activeHeader ? "flex" : "none"} p="1rem" height="100lvh" justifyContent="center" >
        <Box
        bg="#2F4F32"
        color="white"
        p="20px"
        maxW="sm"
        mx="auto"
        >
          <Text>Welcome to the BlackJack Web Local Game</Text>
        </Box>
        <NavLink to="blackjack"><Button>Start the game</Button></NavLink>
      </VStack>
    </Box>
  );
};

export default App;
