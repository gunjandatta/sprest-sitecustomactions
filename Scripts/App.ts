/// <reference path="../node_modules/gd-sprest/dist/sprest.d.ts" />

module GD {
    export class SiteCustomActions {
        // Global Variables
        private static _elementId: string;
        private static _caList: Array<$REST.Types.IUserCustomAction>;

        // List of css files
        private static _cssFiles = [
            { Name: "MyCustomBannerCSS", Url: "Content/banner.css", Sequence: 100, Description: "Styles the banner." }
        ];

        // List of js files
        private static _jsFiles = [
            { Name: "MyCustomBannerJS", Url: "Scripts/banner.js", Sequence: 200, Description: "Adds a custom banner to the top of the page." }
        ];

        // Method to add the custom action
        static addCA() {
            // Get the site
            let customActions = (new $REST.Site())
                // Get the custom actions
                .UserCustomActions();

            // Parse the css files
            for (let caInfo of this._cssFiles) {
                let existsFl = false;

                // Parse the custom actions
                for (let ca of this._caList) {
                    // Ensure this custom action exists
                    if (ca.Name == caInfo.Name) {
                        // Set the flag
                        existsFl = true;
                        break;
                    }
                }

                // See if we need to add this custom action
                if (existsFl) { continue; }

                // Add the custom action
                customActions.add({
                    Description: caInfo.Description ? caInfo.Description : "",
                    Location: "ScriptLink",
                    Name: caInfo.Name,
                    Sequence: caInfo.Sequence ? caInfo.Sequence : 100,
                    ScriptBlock: "var link=document.createElement('link'); link.rel='stylesheet'; link.type='text/css'; link.href='" + window["_spPageContextInfo"].webAbsoluteUrl + "/" + caInfo.Url + "'; document.head.appendChild(link);"
                }).execute();
            }

            // Parse the js files
            for (let caInfo of this._jsFiles) {
                let existsFl = false;

                // Parse the custom actions
                for (let ca of this._caList) {
                    // Ensure this custom action exists
                    if (ca.Name == caInfo.Name) {
                        // Set the flag
                        existsFl = true;
                        break;
                    }
                }

                // See if we need to add this custom action
                if (existsFl) { continue; }

                // Add the custom action
                customActions.add({
                    Description: caInfo.Description ? caInfo.Description : "",
                    Location: "ScriptLink",
                    Name: caInfo.Name,
                    Sequence: caInfo.Sequence ? caInfo.Sequence : 100,
                    ScriptBlock: "var script=document.createElement('script'); script.src='" + window["_spPageContextInfo"].webAbsoluteUrl + "/" + caInfo.Url + "'; document.head.appendChild(script);"
                }).execute();
            }

            // Wait for the requests to complete
            customActions.done(() => {
                // Refresh the page
                document.location.reload();
            });
        }

        // Method to render the panel
        static init(elementId?: string) {
            // Set the element id
            this._elementId = elementId ? elementId : this._elementId;

            // Get the site
            (new $REST.Site())
                // Get the custom actions
                .UserCustomActions()
                // Execute the request
                .execute((customActions) => { this.renderPanel(customActions); });
        }

        // Method to remove the custom action
        static removeCA() {
            // Get the site
            let customActions = (new $REST.Site())
                // Get the custom actions
                .UserCustomActions();

            // Parse the css files
            for (let caInfo of this._cssFiles) {
                // Parse the custom actions
                for (let ca of this._caList) {
                    // Ensure this custom action exists
                    if (ca.Name == caInfo.Name) {
                        customActions
                            // Get the custom action
                            .getById(ca.Id)
                            // Delete it
                            .delete()
                            // Execute the request
                            .execute();

                        // Break from the loop
                        break;
                    }
                }
            }

            // Parse the js files
            for (let caInfo of this._jsFiles) {
                // Parse the custom actions
                for (let ca of this._caList) {
                    // Ensure this custom action exists
                    if (ca.Name == caInfo.Name) {
                        customActions
                            // Get the custom action
                            .getById(ca.Id)
                            // Delete it
                            .delete()
                            // Execute the request
                            .execute();

                        // Break from the loop
                        break;
                    }
                }
            }

            // Wait for the requests to complete
            customActions.done(() => {
                // Refresh the page
                document.location.reload();
            });
        }

        // Method to render the button
        private static renderButtons(disableFl) {
            let el = document.querySelector("#" + this._elementId);

            // Render the button
            el == null ? null : el.innerHTML = '<button type="button" onclick="{{Method}}">{{Text}}</button>'
                .replace(/{{Method}}/g, disableFl ? "return GD.SiteCustomActions.removeCA(this);" : "return GD.SiteCustomActions.addCA(this);")
                .replace(/{{Text}}/g, disableFl ? "Disable" : "Enable");
        }

        // Method to render the panel
        private static renderPanel(customActions: $REST.Types.IUserCustomActions) {
            // Clear the global variables
            this._caList = [];

            // Parse the custom actions
            for (let customAction of customActions.results) {
                let isCSS = false;

                // Parse the css files
                for (let caInfo of this._cssFiles) {
                    // See if this custom action exists
                    if (caInfo.Name == customAction.Name) {
                        // Save a reference to this custom action
                        this._caList.push(customAction);
                        break;
                    }
                }

                // See if the custom action was found
                if (isCSS) { continue; }

                // Parse the js files
                for (let caInfo of this._jsFiles) {
                    // See if this custom action exists
                    if (caInfo.Name == customAction.Name) {
                        // Save a reference to this custom action
                        this._caList.push(customAction);
                        break;
                    }
                }
            }

            // Render the buttons
            this.renderButtons(this._caList.length == this._cssFiles.length + this._jsFiles.length);
        }
    }
}

// Wait for the page to load
window.addEventListener("load", () => {
    // Render the panel
    GD.SiteCustomActions.init("main");
});