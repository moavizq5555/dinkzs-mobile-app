// Dinkzs Mobile App - Capacitor Integration
document.addEventListener("DOMContentLoaded", function () {
  console.log("Dinkzs Mobile App loaded");

  initializeApp();
});

let isLoaded = false;
let retryCount = 0;
const maxRetries = 3;

function initializeApp() {
  // Initialize Capacitor if available
  if (typeof Capacitor !== "undefined") {
    console.log("Capacitor detected, initializing native features");
    initializeCapacitorFeatures();
  } else {
    console.log("Running in web browser mode");
  }

  // Set up event listeners
  setupEventListeners();

  // Start loading the website
  loadWebsite();
}

function initializeCapacitorFeatures() {
  // Initialize Edge-to-Edge support for Android 15+
  initializeEdgeToEdge();

  // Handle app state changes
  if (Capacitor.Plugins.App) {
    Capacitor.Plugins.App.addListener("appStateChange", ({ isActive }) => {
      console.log("App state changed. isActive:", isActive);
    });

    Capacitor.Plugins.App.addListener("appUrlOpen", (data) => {
      console.log("App opened with URL:", data.url);
    });
  }

  // Handle back button (Android)
  if (Capacitor.Plugins.App) {
    Capacitor.Plugins.App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        // Show exit confirmation
        showExitConfirmation();
      }
    });
  }

  // Handle network status
  if (Capacitor.Plugins.Network) {
    Capacitor.Plugins.Network.addListener("networkStatusChange", (status) => {
      console.log("Network status changed:", status);
      if (!status.connected) {
        showNetworkError();
      }
    });
  }

  // Initialize location services
  initializeLocationServices();
}

async function initializeEdgeToEdge() {
  try {
    const { Device } = await import("@capacitor/device");
    const { EdgeToEdge } = await import(
      "@capawesome/capacitor-android-edge-to-edge-support"
    );

    const info = await Device.getInfo();
    if (Capacitor.getPlatform() === "android" && Number(info.osVersion) >= 15) {
      await EdgeToEdge.enable(); // Enable only on Android 15+
      console.log("Edge-to-Edge enabled for Android 15+");
    } else {
      await EdgeToEdge.disable(); // Prevents layout issues on older Android versions
      console.log("Edge-to-Edge disabled for older Android versions");
    }
  } catch (error) {
    console.error("Error initializing Edge-to-Edge:", error);
  }
}

function initializeLocationServices() {
  if (Capacitor.Plugins.Geolocation) {
    console.log("Geolocation plugin available");

    // Request location permissions
    requestLocationPermission();

    // Set up location watcher
    setupLocationWatcher();
  } else {
    console.log("Geolocation plugin not available");
  }
}

async function requestLocationPermission() {
  try {
    if (Capacitor.Plugins.Geolocation) {
      const permission = await Capacitor.Plugins.Geolocation.checkPermissions();
      console.log("Location permission status:", permission);

      if (permission.location === "prompt") {
        const request =
          await Capacitor.Plugins.Geolocation.requestPermissions();
        console.log("Location permission requested:", request);
      }
    }
  } catch (error) {
    console.error("Error requesting location permission:", error);
  }
}

function setupLocationWatcher() {
  if (Capacitor.Plugins.Geolocation) {
    // Watch for location changes
    Capacitor.Plugins.Geolocation.watchPosition({}, (position, err) => {
      if (err) {
        console.error("Location watch error:", err);
        return;
      }

      console.log("Location updated:", position);
      sendLocationToWebView(position);
    });
  }
}

function sendLocationToWebView(position) {
  const webview = document.getElementById("webview");
  if (webview && webview.contentWindow) {
    const locationData = {
      type: "location",
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    };

    try {
      webview.contentWindow.postMessage(locationData, "https://playdinkzs.com");
    } catch (error) {
      console.error("Error sending location to webview:", error);
    }
  }
}

async function getCurrentLocation() {
  try {
    if (Capacitor.Plugins.Geolocation) {
      const position = await Capacitor.Plugins.Geolocation.getCurrentPosition();
      return position;
    } else {
      // Fallback to browser geolocation
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
          reject(new Error("Geolocation not supported"));
        }
      });
    }
  } catch (error) {
    console.error("Error getting current location:", error);
    throw error;
  }
}

function setupEventListeners() {
  // Handle orientation changes
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      // Re-adjust layout after orientation change
      if (typeof Capacitor !== "undefined" && Capacitor.Plugins.StatusBar) {
        Capacitor.Plugins.StatusBar.setStyle({ style: "light" });
      }
    }, 100);
  });

  // Handle online/offline events
  window.addEventListener("online", () => {
    console.log("Device is online");
    hideNetworkError();
    if (!isLoaded) {
      loadWebsite();
    }
  });

  window.addEventListener("offline", () => {
    console.log("Device is offline");
    showNetworkError();
  });

  // Listen for messages from the webview
  window.addEventListener("message", handleWebViewMessage);
}

function handleWebViewMessage(event) {
  // Only accept messages from our trusted domain
  if (event.origin === "https://playdinkzs.com") {
    console.log("Message from webview:", event.data);

    if (event.data.type === "requestLocation") {
      handleLocationRequest();
    } else if (event.data.type === "requestCamera") {
      handleCameraRequest();
    }
  }
}

async function handleLocationRequest() {
  try {
    const position = await getCurrentLocation();
    const locationData = {
      type: "location",
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    };

    const webview = document.getElementById("webview");
    if (webview && webview.contentWindow) {
      webview.contentWindow.postMessage(locationData, "https://playdinkzs.com");
    }
  } catch (error) {
    console.error("Error handling location request:", error);
    const errorData = {
      type: "locationError",
      error: error.message,
    };

    const webview = document.getElementById("webview");
    if (webview && webview.contentWindow) {
      webview.contentWindow.postMessage(errorData, "https://playdinkzs.com");
    }
  }
}

async function handleCameraRequest() {
  try {
    if (Capacitor.Plugins.Camera) {
      const image = await Capacitor.Plugins.Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: "base64",
      });

      const cameraData = {
        type: "camera",
        image: image.base64String,
        format: image.format,
      };

      const webview = document.getElementById("webview");
      if (webview && webview.contentWindow) {
        webview.contentWindow.postMessage(cameraData, "https://playdinkzs.com");
      }
    }
  } catch (error) {
    console.error("Error handling camera request:", error);
  }
}

function loadWebsite() {
  console.log("Loading Dinkzs website...");
  const webview = document.getElementById("webview");
  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("errorMessage");
  const gifImg = document.getElementById("loadingGif");

  // Show loading screen with GIF
  if (loading) {
    loading.style.display = "flex";
  }
  if (errorMessage) {
    errorMessage.style.display = "none";
  }

  // Set up status bar for loading
  if (typeof Capacitor !== "undefined" && Capacitor.Plugins.StatusBar) {
    Capacitor.Plugins.StatusBar.setStyle({ style: "light" });
    Capacitor.Plugins.StatusBar.setBackgroundColor({ color: "#ffffff" });
  }

  // Show GIF for a specific duration before loading webview
  const gifDisplayDuration = 1000; // 3 seconds - adjust if needed
  console.log(
    `Showing GIF for ${gifDisplayDuration}ms before loading webview...`
  );

  const startDelayThenLoad = () => {
    setTimeout(() => {
      console.log("GIF display time completed, now loading webview...");
      if (webview) {
        webview.src = "https://playdinkzs.com/";
      }
    }, gifDisplayDuration);
  };

  if (gifImg) {
    if (gifImg.complete) {
      startDelayThenLoad();
    } else {
      gifImg.addEventListener("load", startDelayThenLoad, { once: true });
      gifImg.addEventListener(
        "error",
        () => {
          console.warn("GIF failed to load; proceeding after delay.");
          startDelayThenLoad();
        },
        { once: true }
      );
    }
  } else {
    // Fallback if GIF element missing
    startDelayThenLoad();
  }
}

function onWebViewLoad() {
  console.log("WebView loaded successfully");
  isLoaded = true;
  retryCount = 0;

  const loading = document.getElementById("loading");
  const webview = document.getElementById("webview");

  // Hide loading screen with fade effect
  if (loading) {
    loading.style.opacity = "0";
    loading.style.transition = "opacity 0.5s ease-out";
    setTimeout(() => {
      loading.style.display = "none";
    }, 500);
  }

  // Show webview
  if (webview) {
    webview.style.opacity = "0";
    webview.style.transition = "opacity 0.5s ease-in";
    setTimeout(() => {
      webview.style.opacity = "1";
    }, 100);
  }

  // Inject mobile optimizations
  setTimeout(() => {
    injectMobileOptimizations();
  }, 1000);

  // Set up status bar for webview
  if (typeof Capacitor !== "undefined" && Capacitor.Plugins.StatusBar) {
    Capacitor.Plugins.StatusBar.setStyle({ style: "light" });
    Capacitor.Plugins.StatusBar.setBackgroundColor({ color: "#ffffff" });
  }
}

function onWebViewError() {
  console.error("WebView failed to load");
  retryCount++;

  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("errorMessage");

  if (retryCount <= maxRetries) {
    console.log(`Retrying... Attempt ${retryCount}/${maxRetries}`);
    setTimeout(() => {
      loadWebsite();
    }, 2000);
  } else {
    // Show error message
    if (loading) {
      loading.style.display = "none";
    }
    if (errorMessage) {
      errorMessage.style.display = "block";
    }
  }
}

function reloadWebView() {
  isLoaded = false;
  retryCount = 0;
  loadWebsite();
}

function injectMobileOptimizations() {
  const webview = document.getElementById("webview");
  if (webview && webview.contentWindow) {
    try {
      // Inject CSS for mobile optimization
      const css = `
        body {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `;

      const style = document.createElement("style");
      style.textContent = css;
      webview.contentDocument.head.appendChild(style);
    } catch (error) {
      console.log("Could not inject mobile optimizations:", error);
    }
  }
}

function showNetworkError() {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.style.display = "block";
  }
}

function hideNetworkError() {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.style.display = "none";
  }
}

async function showExitConfirmation() {
  try {
    if (Capacitor.Plugins.Dialog) {
      const result = await Capacitor.Plugins.Dialog.confirm({
        title: "Exit Dinkzs",
        message: "Are you sure you want to exit the app?",
        okButtonTitle: "Exit",
        cancelButtonTitle: "Cancel",
      });

      if (result.value) {
        if (Capacitor.Plugins.App) {
          Capacitor.Plugins.App.exitApp();
        }
      }
    }
  } catch (error) {
    console.error("Error showing exit confirmation:", error);
  }
}

function handleDeepLink(url) {
  console.log("Handling deep link:", url);
  const webview = document.getElementById("webview");
  if (webview) {
    webview.src = url;
  }
}

// Expose functions globally for external access
window.DinkzsApp = {
  reload: reloadWebView,
  handleDeepLink: handleDeepLink,
  showExitConfirmation: showExitConfirmation,
  getCurrentLocation: getCurrentLocation,
  requestLocationPermission: requestLocationPermission,
};
