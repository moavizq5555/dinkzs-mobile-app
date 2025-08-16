import UIKit
import Capacitor
import Lottie

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var animationView: LottieAnimationView?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {

        // Create window
        window = UIWindow(frame: UIScreen.main.bounds)

        // Create a root VC just for splash
        let splashVC = UIViewController()
        window?.rootViewController = splashVC
        window?.makeKeyAndVisible()

        // Setup Lottie Animation
        animationView = LottieAnimationView(name: "splash_animation") // <- use your splash.json name
        animationView?.frame = splashVC.view.bounds
        animationView?.contentMode = .scaleAspectFill
        animationView?.loopMode = .playOnce

        if let animationView = animationView {
            splashVC.view.addSubview(animationView)

            // Play animation
            animationView.play { [weak self] _ in
                self?.showMainApp()
            }
        }

        return true
    }

    private func showMainApp() {
        // Load Capacitor WebView after splash
        let capacitorVC = CAPBridgeViewController()
        window?.rootViewController = capacitorVC
    }
}
