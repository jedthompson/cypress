package edu.umd.cypress.android;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

public class CypressActivity extends Activity {
    /** Called when the activity is first created. */
	public void doUpdate() {
		HttpClient c = new DefaultHttpClient();
		HttpGet g = new HttpGet("http://www.terpconnect.umd.edu/~srl");
		try {
			c.execute(g);
			Log.w("UPDATE", "Executed request");
		} catch (Exception e) {
			Log.e("UPDATE", "Exception occurred", e);
			finish();
		}
	}
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        final Button updateButton = (Button)findViewById(R.id.updateButton);
        updateButton.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				doUpdate();
			}
		});
    }
}
