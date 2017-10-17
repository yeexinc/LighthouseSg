import React from 'react';
import ReactDOM from 'react-dom';
import * as Ons from 'react-onsenui';
import * as ons from 'onsenui';

import { LoadingSection, NotifErrand, currentDateTime } from './utilities/PageUtilities';

export class NotificationsPage extends React.Component {
    constructor(props) {
        super(props);

        this.user = props.user;
        this.database = props.database;
        this.navigator = props.navigator;
        this.onNotifsLoaded = this.onNotifsLoaded.bind(this);
        this.onRespondBtnClicked = this.onRespondBtnClicked.bind(this);

        this.notifs = [];
        this.state = {
            notifsLoaded: false
        }

        this.database.registerNewNotifCallback(this.onNewNotifsAdded.bind(this));
    }

    componentWillMount() {
        // Fetch the notifs from the database
        this.database.getListedErrands(this.user.userID, this.onNotifsLoaded);
    }

    onNotifsLoaded(result) {
        this.notifs = result;
        this.setState({ notifsLoaded: true });
    }

    onRespondBtnClicked(respond, errID) {
        if (respond, errID) {
            var offeredErrand = this.onNotifAccepted(errID);
            this.database.addNewOffer(offeredErrand);
        }
        else {
            console.log("The request has been rejected.");
        }
    }

    onNewNotifsAdded(newErrand) {
        this.notifs.push(newErrand);
        this.setState({ notifsLoaded: true });
    }

    onNotifAccepted(errID) {
        for (var i = 0; i < this.notifs.length; i++) {
            if (this.notifs[i].errID == errID) {
                var x = this.notifs[i]; // get the errand
                this.notifs.splice(i, 1); // remove the errand from notifs

                // ASSIGN THE INFORMATION OF VOLUNTEER WHO OFFERED
                x.volID = this.user.userID;
                x.volName = this.user.accName;
                x.status = "offered";
                x.updatedDate = currentDateTime();
                this.setState({ notifsLoaded: true }); // refresh the UI
                return x;
            }
        }
    }

    render() {
        var notifsAr = [];
        if (!this.state.notifsLoaded) {
            return (
                <Ons.Page renderToolbar={this.renderToolbar.bind(this)}>
                    <LoadingSection text="Loading notifications..." />
                </Ons.Page>
            );
        }
        else {
            for (var i = 0; i < this.notifs.length; i++) {
                var n = this.notifs[i];
                var notifKey = "notif-card-" + i;
                notifsAr.push(<NotifErrand errand={n} navigator={this.navigator} database={this.database} userType={this.user.userType} onRespondBtnClicked={this.onRespondBtnClicked} key={notifKey} />)
            }
        }

        var notifText = (notifsAr.length > 0) ? "You have " + notifsAr.length + " notification(s)." : "You do not have any new notifications.";

        return (
            <Ons.Page>
                <section style={{ margin: '16px' }}>
                    {notifText}
                    {notifsAr}
                </section>
            </Ons.Page>
        );
    }
}