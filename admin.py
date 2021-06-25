#!/usr/bin/python
# 164 Toolbox
# Curses Admin Utility
# Konstantin Zaremski
# June 25, 20215

# Requires: pymongo

# Import dependencies
from datetime import datetime
import pymongo
import npyscreen
import time


# Warn the user for the potential of production data damage
class StartupWarning(npyscreen.Form):
    def create(self):
        self.add(npyscreen.FixedText, value="This application has direct control over the", editable=False)
        self.add(npyscreen.FixedText, value="production database. Press ENTER to accept", editable=False)
        self.add(npyscreen.FixedText, value="this warning and continue, or ^C to return", editable=False)
        self.add(npyscreen.FixedText, value="to the shell.", editable=False)

    def afterEditing(self):
        self.parentApp.setNextForm(None)

class ToolboxAdminApp(npyscreen.NPSAppManaged):
    def onStart(self):
        self.addForm("MAIN", StartupWarning, name="ATTENTION", lines=8, columns=50)

# Main
if __name__ == '__main__':
    AdminApp = ToolboxAdminApp()
    AdminApp.run()
