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
        
        // Construct RemoteViews
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_quick_add);

        // 1. Last Workout Text
        // Capacitor Preferences key prefix is usually "CapacitorStorage"
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        String lastWorkout = prefs.getString("widget_last_workout", "No recent workouts");
        views.setTextViewText(R.id.last_workout_text, lastWorkout);

        // 2. Bind ListView Adapter
        Intent serviceIntent = new Intent(context, WidgetService.class);
        serviceIntent.setData(android.net.Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));
        views.setRemoteAdapter(R.id.widget_list, serviceIntent);
        views.setEmptyView(R.id.widget_list, R.id.last_workout_text); // Fallback view? or separate empty view

        // 3. Set PendingIntent Template for List Items
        Intent clickIntent = new Intent(Intent.ACTION_VIEW);
        // We don't set package or class here to let the system resolve it, 
        // OR if we know it opens our app, we can be specific.
        // Being specific is better.
        clickIntent.setPackage(context.getPackageName());
        clickIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        
        PendingIntent clickPendingIntent = PendingIntent.getActivity(context, 0, clickIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
        views.setPendingIntentTemplate(R.id.widget_list, clickPendingIntent);

        // 4. Widget Title Click -> Open App
        Intent openAppIntent = new Intent(Intent.ACTION_VIEW);
        openAppIntent.setData(android.net.Uri.parse("fitwidget://open"));
        openAppIntent.setPackage(context.getPackageName());
        PendingIntent openAppPendingIntent = PendingIntent.getActivity(context, 0, openAppIntent, PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.appwidget_text, openAppPendingIntent);

        // 5. Update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
        appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_list);
    }

    private static PendingIntent getPendingIntent(Context context, String uriString) {
        Intent intent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(uriString));
        return PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }
}
