Your Grace, the **backend** should handle the notification feature, as it ensures consistency and reliability across both the admin and public applications.  

### Why the Backend?  
1. **Centralised Logic** – The backend can detect when an event's status changes to `CANCELLED` and trigger notifications automatically.  
2. **Real-time or Scheduled Notifications** – It can send notifications via WebSockets, push notifications, or emails.  
3. **Scalability** – If notifications were handled on the frontend every client would need polling or manual refreshes to check for updates.  

---

### Implementation Approach  
1. **Backend (Express + Database)**
   - Listen for event updates (`PATCH /events/:id`).
   - When an event is marked as `CANCELLED`, fetch all affected users.  
   - Send notifications via WebSockets, emails, or push notifications.

   ```js
   import express from "express";
   import { sendNotification } from "./notificationService.js"; // A service to handle notifications
   import db from"./db.js"; // Database connection

   const app = express();
   app.use(express.json());

   app.patch("/events/:id", async (req, res) => {
       const { id } = req.params;
       const { status } = req.body;

       if (status === "CANCELLED") {
           // Update event status
           await db.query("UPDATE events SET status = $1 WHERE id = $2", [status, id]);

           // Fetch users with reservations for this event
           const users = await db.query(
               "SELECT user_id FROM reervations WHERE event_id = $1",
               [id]
           );

           // Send notifications
           users.rows.forEach(user => {
               sendNotification(user.user_id, `The event you booked has been cancelled.`);
           });
       }

       res.json({ message: "Event updated" });
   });

   app.listen(3000, () => console.log("Server running"));
   ```

2. **Frontend-Public (Listening for Notifications)**
   - If using WebSockets:
     ```js
     const socket = new WebSocket("ws://yur-backend-url");
     socket.onmessage = event => {
         alert(event.data); // Show notification
     };
     ```
   - If using Firebase push notifications or emails, users will receive them automatically.

3. **Frontend-Admin**
   - Simply allows setting `CANCELLED`, no need for extra notification logic.

---

### Conclusion  
- **Backend** detects cancellation and sends notifications.  
- **Frontend-Public** listens and displays notifications.  
- **Frontend-Admin** only updates the event status. 

Would you like notifications via WebSockets, push notifications (Firebase), or emails?