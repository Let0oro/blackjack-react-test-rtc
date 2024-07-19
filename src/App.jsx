import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { Box, Button, Text, VStack } from "@chakra-ui/react";

const App = () => {
  const [activeHeader, setActiveHeader] = useState(true);
  const location = useLocation();

  useMemo(() => {
    console.log(location.pathname);
    setActiveHeader(location.pathname != "/blackjack");
  }, [location]);

  return (
    <Box>
      <VStack display={activeHeader ? "flex" : "none"} p="1rem"  >
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
      <Outlet />
    </Box>
  );
};

export default App;
