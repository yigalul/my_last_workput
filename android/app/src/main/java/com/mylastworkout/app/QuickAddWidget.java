package com.mylastworkout.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.widget.RemoteViews;

public class QuickAddWidget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        
        // 1. Get Shared Preferences (Capacitor stores data here)
        // Capacitor Preferences key prefix is usually "CapacitorStorage"
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        // The key we will use in App.tsx is "widget_last_workout"
        String lastWorkout = prefs.getString("widget_last_workout", "No recent workout");

        // 2. Setup Intents for Buttons
        PendingIntent piChest = getPendingIntent(context, "fitwidget://log/Chest");
        PendingIntent piBack = getPendingIntent(context, "fitwidget://log/Back");
        PendingIntent piShoulders = getPendingIntent(context, "fitwidget://log/Shoulders");
        
        // Intent for clicking the title (opens main app)
        PendingIntent piMain = getPendingIntent(context, "fitwidget://open");

        // 3. Construct RemoteViews
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_quick_add);
        
        // Set Text
        views.setTextViewText(R.id.last_workout_text, lastWorkout);

        // Set Click Listeners
        views.setOnClickPendingIntent(R.id.btn_chest, piChest);
        views.setOnClickPendingIntent(R.id.btn_back, piBack);
        views.setOnClickPendingIntent(R.id.btn_shoulders, piShoulders);
        views.setOnClickPendingIntent(R.id.appwidget_text, piMain); // Clicking title opens app

        // 4. Update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    private static PendingIntent getPendingIntent(Context context, String uriString) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(uriString));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        return PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
}
