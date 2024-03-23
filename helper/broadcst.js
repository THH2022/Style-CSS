Client.on_message(filters.command("broadcast") & filters.user(AUTHORIZED_USERS) & filters.reply, async function(bot, message) {
    var users = await db.get_all_users();
    var b_msg = message.reply_to_message;
    var sts = await message.reply_text({
        text: 'Broadcasting your messages...'
    });
    var start_time = time.time();
    var total_users = await db.total_users_count();
    var done = 0;
    var blocked = 0;
    var deleted = 0;
    var failed = 0;
    var success = 0;
    var user, pti, sh;
    for (var i = 0; i < users.length; i++) {
        user = users[i];
        pti, sh = await broadcast_messages(parseInt(user['id']), b_msg);
        if (pti) {
            success += 1;
        } else if (pti == false) {
            if (sh == "Blocked") {
                blocked += 1;
            } else if (sh == "Deleted") {
                deleted += 1;
            } else if (sh == "Error") {
                failed += 1;
            }
        }
        done += 1;
        await asyncio.sleep(2);
        if (!(done % 20)) {
            await sts.edit("Broadcast in progress:\n\nTotal Users " + total_users + "\nCompleted: " + done + " / " + total_users + "\nSuccess: " + success + "\nBlocked: " + blocked + "\nDeleted: " + deleted);
        }
    }
    var time_taken = datetime.timedelta({
        seconds: parseInt(time.time() - start_time)
    });
    await sts.edit("Broadcast Completed:\nCompleted in " + time_taken + " seconds.\n\nTotal Users " + total_users + "\nCompleted: " + done + " / " + total_users + "\nSuccess: " + success + "\nBlocked: " + blocked + "\nDeleted: " + deleted);
});

Client.on_message(filters.command("gbroadcast") & filters.user(ADMINS) & filters.reply, async function(bot, message) {
    var chats = await db.get_all_chats();
    var b_msg = message.reply_to_message;
    var sts = await message.reply_text({
        text: 'Broadcasting your messages...'
    });
    var start_time = time.time();
    var total_chats = await db.total_chat_count();
    var done = 0;
    var failed = 0;
    var success = 0;
    var chat, pti, sh;
    for (var i = 0; i < chats.length; i++) {
        chat = chats[i];
        pti, sh = await broadcast_messages(parseInt(chat['id']), b_msg);
        if (pti) {
            success += 1;
        } else if (pti == false) {
            if (sh == "Blocked") {
                blocked += 1;
            } else if (sh == "Deleted") {
                deleted += 1;
            } else if (sh == "Error") {
                failed += 1;
            }
        }
        done += 1;
        await asyncio.sleep(2);
        if (!(done % 20)) {
            await sts.edit("Broadcast in progress:\n\nTotal Chats " + total_chats + "\nCompleted: " + done + " / " + total_chats + "\nSuccess: " + success + "\nFailed: " + failed);
        }
    }
    var time_taken = datetime.timedelta({
        seconds: parseInt(time.time() - start_time)
    });
    await sts.edit("Broadcast Completed:\nCompleted in " + time_taken + " seconds.\n\nTotal Chats " + total_chats + "\nCompleted: " + done + " / " + total_chats + "\nSuccess: " + success + "\nFailed: " + failed);
});

