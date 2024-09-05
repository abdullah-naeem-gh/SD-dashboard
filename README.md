# Stable Diffusion Text-2-Image Generator Dashboard

This project provides a dashboard for a Stable Diffusion Text-2-Image Generator, utilizing a custom Docker container deployed on Runpod Serverless.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/abdullah-naeem-gh/SD-dashboard
   ```

2. Create a `.env` file at the root with the following structure:
   ```
   serverless_api_id=your_serverless_api_id
   api_key=your_api_key
   ```
   Deploy the Docker container of the model onto your Runpod serverless and then paste your Runpod API key and the serverless API ID into the `.env` file.

3. Install dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Project Description

This project consists of a Stable Diffusion Worker with added model checkpoints, containerized in a Docker image. The dashboard is developed to interact with the serverless endpoints and display generated images.

### Docker Container

The Docker container is available at:
[https://hub.docker.com/repository/docker/abdullahnaeem11/sd-dashboard/general](https://hub.docker.com/repository/docker/abdullahnaeem11/sd-dashboard/general)

It includes:
- realistic-Vixion-vxl SDv1.5 checkpoint
- Openpose and IP-Adaptor ControlNets
- Reactor Extension for face swap

The container is designed to be deployed on a Runpod Serverless as a Template.

### Project Structure

- `src/index.ts`: Contains the backend code to send API requests, developed using Node.js and Express.js.
- `views/`: Contains EJS files for static HTML pages, rendered server-side.
- `public/`: Directory where generated images are stored.

## External Deployed Dashboard

The source code in this repository corresponds to a plain dashboard developed to interact with the serverless endpoints and display the generated images.

---

For more information or contributions, please open an issue or submit a pull request.