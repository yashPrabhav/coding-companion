import { useState } from "react";
import "./Settings.css";

function Settings() {

    const [settings, setSettings] = useState({

        appearance: [
            {
                id: 1,
                title: "Theme",
                enabled: true,
            },
        ],

        notifications: [
            {
                id: 1,
                title: "Daily Reminder",
                enabled: true,
            },
            {
                id: 2,
                title: "Weekly Progress Summary",
                enabled: true,
            },
        ],

        language: {
            value: "English",
        },

        about: {
            appName: "Coding Companion",
            version: "1.0 MVP",
        },

    });

    function toggleSetting(section, id) {

        setSettings((prevSettings) => ({

            ...prevSettings,

            [section]: prevSettings[section].map((setting) =>

                setting.id === id
                    ? { ...setting, enabled: !setting.enabled }
                    : setting

            ),

        }));

    }

    return (

        <div className="settings-page">

            <h1>Settings</h1>

            {/* Appearance */}

            <div className="settings-section">

                <h2>Appearance</h2>

                {settings.appearance.map((setting) => (

                    <div
                        className="setting-row"
                        key={setting.id}
                    >

                        <span>{setting.title}</span>

                        <input
                            type="checkbox"
                            checked={setting.enabled}
                            onChange={() => toggleSetting("appearance", setting.id)}
                        />

                    </div>

                ))}

            </div>

            {/* Notifications */}

            <div className="settings-section">

                <h2>Notifications</h2>

                {settings.notifications.map((setting) => (

                    <div
                        className="setting-row"
                        key={setting.id}
                    >

                        <span>{setting.title}</span>

                        <input
                            type="checkbox"
                            checked={setting.enabled}
                            onChange={() => toggleSetting("notifications", setting.id)}
                        />

                    </div>

                ))}

            </div>

            {/* Language */}

            <div className="settings-section">

                <h2>Language</h2>

                <div className="setting-row">

                    <span>Language</span>

                    <span>{settings.language.value}</span>

                </div>

            </div>

            {/* About */}

            <div className="settings-section">

                <h2>About</h2>

                <div className="setting-row">

                    <span>App</span>

                    <span>{settings.about.appName}</span>

                </div>

                <div className="setting-row">

                    <span>Version</span>

                    <span>{settings.about.version}</span>

                </div>

            </div>

        </div>

    );

}

export default Settings;