# Cheth - Chess Wagering Platform

Cheth is a decentralized application that enables users to wager on chess games using their cryptocurrency wallets and Lichess accounts. By leveraging Virtual Labs rollup technology and external APIs, Cheth offers a secure and fast betting platform where users can deposit funds, match against opponents, and have game outcomes decided through trusted Lichess results.

## Features

- **Cryptocurrency Wallet Integration:** Users can connect their MetaMask wallets to deposit and withdraw funds for wagers.
- **Lichess Authentication:** Users authenticate with their Lichess accounts to validate game results.
- **Decentralized Session Management:** Sessions are handled through Virtual Labs rollup infrastructure, ensuring fast and secure betting operations.
- **Session and Participant Management:** Automatically creates and fetches participant details, ensuring seamless integration between users and game sessions.
- **Redux State Management:** The frontend is managed through Redux, tracking wallet connections, user sessions, and Lichess authentication state.

## Project Structure

### `/src/app`
- **API Routes:** All backend logic handling API requests.
  - **`/api/user/connect`:** Endpoint for wallet connection and session creation.
  - **`/api/lichess/login`:** Handles the OAuth flow for Lichess authentication.
  - **`/api/participant`:** Manages participants within game sessions.
  - **`/api/session/deposit`:** Handles fund deposits into game sessions.

- **Dashboard:** The main page that shows user information, session details, and Lichess authentication status.
- **Global Styles:** Global CSS styles for the application.

### `/src/components`
- **Header:** Displays the wallet connection status and provides a button to authenticate with Lichess.
- **Deposit Form:** Allows users to deposit funds into their session.
- **ReduxStateDisplay:** Displays the current state of the Redux store.

### `/src/services`
- **auth.ts:** Manages the wallet connection and sends authentication requests to the backend.
- **lichessAuth.ts:** Handles the Lichess login flow and manages cookies for the OAuth process.
- **participant.ts:** Sends participant creation and fetching requests to the backend.
- **session.ts:** Manages session creation, fund deposits, and session state.

### `/src/externalServices/virtualLabs`
- **player.ts:** Handles player creation in Virtual Labs, integrating with the rollup infrastructure.
- **participant.ts:** Fetches or creates a participant for a session using the Virtual Labs API.
- **session.ts:** Creates sessions and handles session-specific logic like balance updates.
  
### `/src/repositories`
- **userRepository.ts:** Handles database queries related to users and Lichess tokens.

### `/src/slices`
- Redux slices managing the application’s state:
  - **user.ts:** Tracks wallet connection, Lichess authentication, and user session data.
  - **session.ts:** Stores session information such as session ID, balance, and status.
  - **participant.ts:** Stores participant details, including participant ID and balance.

## How It Works

1. **Wallet Connection:** The user connects their MetaMask wallet through the frontend. The wallet address and signature are sent to the backend to authenticate and create a session in Virtual Labs.
2. **Lichess Authentication:** After connecting their wallet, the user can authenticate with Lichess using OAuth. The token is stored in the database and used to track game results.
3. **Session Creation & Participant Management:** Once authenticated, a session is created in Virtual Labs, and the user becomes a participant within that session.
4. **Placing Bets & Game Results:** The user deposits funds into the session, wagers are matched, and the outcome of the chess game on Lichess decides the winner.

## Tech Stack

- **Frontend:**
  - Next.js
  - Redux (for state management)
  - Tailwind CSS (for styling)
  
- **Backend:**
  - Next.js API routes
  - Prisma (for database interaction)
  - Virtual Labs API (for decentralized session management)
  - Lichess API (for chess game authentication)

- **Database:**
  - SQLite (via Prisma)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/cheth.git
   cd cheth

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a .env file:**
   ```bash
   cp .env.example .env
   ```
   Update the .env file with your Virtual Labs API url and Lichess client ID.

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000 in your browser.**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
