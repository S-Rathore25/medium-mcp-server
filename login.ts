import { BrowserMediumClient } from './src/browser-client';

async function main() {
  console.log("🚀 Starting Medium Login Helper...");
  const client = new BrowserMediumClient();
  
  try {
    await client.initialize();
    console.log("🌐 Browser opened. Please wait...");
    
    // This will open the login page and wait for you to login manually
    const success = await client.ensureLoggedIn();
    
    if (success) {
      console.log("✅ Login successful! The file 'medium-session.json' has been created.");
      console.log("You can now copy the contents of that file to your Render Environment Variables.");
    } else {
      console.log("❌ Login failed.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

main();
