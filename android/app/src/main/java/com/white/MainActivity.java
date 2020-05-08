package com.white;

import com.facebook.react.ReactActivity;

import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.util.DisplayMetrics;
import android.view.Window;
import android.view.WindowManager;
import android.os.Bundle;

import androidx.annotation.RequiresApi;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
  @Override
  public void onCreate(Bundle savedInstanceState) {
    getWindow().setStatusBarColor(Color.TRANSPARENT);
    super.onCreate(savedInstanceState);
    // remove title
  }

  @Override
  protected String getMainComponentName() {
    return "White";
  }
}
