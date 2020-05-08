package com.white;

import com.facebook.react.ReactActivity;
import android.view.View;
import android.util.DisplayMetrics;
import android.view.Window;
import android.view.WindowManager;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

//  @Override
//  public void onCreate(Bundle savedInstanceState) {
////    requestWindowFeature(Window.FEATURE_NO_TITLE);
////    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
////            WindowManager.LayoutParams.FLAG_FULLSCREEN);
//    hideSystemUI();
//    super.onCreate(savedInstanceState);
//    // remove title
//  }
//
//  public void hideSystemUI(){
//    getWindow().getDecorView().setSystemUiVisibility(
//            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
//                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
//                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
//                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
//                    | View.SYSTEM_UI_FLAG_FULLSCREEN
//                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
//  }

  @Override
  protected String getMainComponentName() {
    return "White";
  }
}
