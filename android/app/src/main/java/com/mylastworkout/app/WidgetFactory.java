package com.mylastworkout.app;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class WidgetFactory implements RemoteViewsService.RemoteViewsFactory {
    private Context context;
    private List<WidgetItem> items = new ArrayList<>();

    public WidgetFactory(Context context, Intent intent) {
        this.context = context;
    }

    private class WidgetItem {
        String id;
        String label;
        WidgetItem(String id, String label) { this.id = id; this.label = label; }
    }

    @Override
    public void onCreate() {
        // Initial load
        loadData();
    }

    @Override
    public void onDataSetChanged() {
        // Reload data (called when notifyAppWidgetViewDataChanged is triggered)
        loadData();
    }

    private void loadData() {
        items.clear();
        try {
            SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
            String jsonStr = prefs.getString("widget_buttons", "[]");
            JSONArray jsonArray = new JSONArray(jsonStr);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                items.add(new WidgetItem(obj.getString("id"), obj.getString("label")));
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback if empty or error
            if (items.isEmpty()) {
                items.add(new WidgetItem("Chest", "Chest"));
                items.add(new WidgetItem("Back", "Back"));
                items.add(new WidgetItem("Shoulders", "Shoulders"));
            }
        }
    }

    @Override
    public void onDestroy() {
        items.clear();
    }

    @Override
    public int getCount() {
        return items.size();
    }

    @Override
    public RemoteViews getViewAt(int position) {
        if (position >= items.size()) return null;
        
        WidgetItem item = items.get(position);
        RemoteViews rv = new RemoteViews(context.getPackageName(), R.layout.widget_item);
        
        rv.setTextViewText(R.id.widget_item_text, item.label);

        // Fill In Intent
        Intent fillInIntent = new Intent();
        fillInIntent.setData(android.net.Uri.parse("fitwidget://log/" + item.id));
        rv.setOnClickFillInIntent(R.id.widget_item_text, fillInIntent);

        return rv;
    }

    @Override
    public RemoteViews getLoadingView() {
        return null;
    }

    @Override
    public int getViewTypeCount() {
        return 1;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }
}
