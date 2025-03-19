# Temporary Note Sharing App

A simple, secure application for sharing temporary notes that automatically expire after a set period. Perfect for sharing sensitive information that shouldn't persist indefinitely.

## Features

- **Temporary Notes**: Create notes that automatically expire after a configurable time period
- **Secure Sharing**: Generate unique links to share your notes securely
- **Password Protection**: Optionally protect notes with a password
- **One-time View**: Option to make notes viewable only once
- **No Account Required**: Create and share notes without registration
- **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js with App Router, React, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Vercel KV (Redis) for storing encrypted notes
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Vercel account (for deployment and KV database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/temporary-note-sharing-app.git
cd temporary-note-sharing-app
```

2. Install dependencies:

```shellscript
npm install
# or
yarn install
```


3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```plaintext
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_rest_api_read_only_token
```


4. Run the development server:

```shellscript
npm run dev
# or
yarn dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Usage

### Creating a Note

1. Enter your note content in the text area
2. Set an expiration time (5 minutes, 1 hour, 1 day, 1 week)
3. Optionally set a password
4. Click "Create Note"
5. Copy the generated link to share with others


### Viewing a Note

1. Open the shared link
2. Enter the password if the note is password-protected
3. View the note content
4. The note will be deleted after viewing (if one-time view is enabled) or after the expiration time


## Deployment

The easiest way to deploy this application is using Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set up the required environment variables
4. Deploy


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
