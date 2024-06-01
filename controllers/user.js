import User from "../models/User";

// Read
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);

  } catch (error) {
    res.status(404).json({ message: error.message }); 
  }
}

// user friends
export const getUserFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // formatting all the user friends
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update user friends (add and remove)
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.body;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // if has then remove 
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // if does not have then add 
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();


    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    // formatting all the user friends
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
    
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}