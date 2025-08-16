package com.lovable.dinkzs;

import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.FrameLayout;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private FrameLayout splashLayout;
    private boolean pageLoaded = false;
    private boolean minDurationPassed = false;
    private static final int SPLASH_MIN_DURATION = 2500; // 2.5 seconds

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Inflate splash layout above WebView
        getLayoutInflater().inflate(
                R.layout.splash_screen,
                getWindow().getDecorView().findViewById(android.R.id.content),
                true
        );

        splashLayout = findViewById(R.id.splashContainer);

        // Track when page finishes
        WebView webView = this.bridge.getWebView();
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                pageLoaded = true;
                maybeHideSplash();
            }
        });

        // Ensure splash stays at least SPLASH_MIN_DURATION
        new Handler().postDelayed(() -> {
            minDurationPassed = true;
            maybeHideSplash();
        }, SPLASH_MIN_DURATION);
    }

    private void maybeHideSplash() {
        if (pageLoaded && minDurationPassed) {
            fadeOutSplash();
        }
    }

    private void fadeOutSplash() {
        if (splashLayout == null || splashLayout.getVisibility() == View.GONE) return;

        AlphaAnimation fadeOut = new AlphaAnimation(1f, 0f);
        fadeOut.setDuration(800);
        fadeOut.setFillAfter(true);

        fadeOut.setAnimationListener(new Animation.AnimationListener() {
            @Override public void onAnimationStart(Animation animation) {}
            @Override public void onAnimationRepeat(Animation animation) {}
            @Override
            public void onAnimationEnd(Animation animation) {
                splashLayout.setVisibility(View.GONE);
            }
        });

        splashLayout.startAnimation(fadeOut);
    }
}
