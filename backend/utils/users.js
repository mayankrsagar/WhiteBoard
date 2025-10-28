const users = [];

export function userJoin(id, username, room, host = false, presenter = false) {
  const user = { id, username, room, host, presenter };
  users.push(user);
  return user;
}

export function userLeave(id) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) return users.splice(idx, 1)[0];
}

export function getUsers(room) {
  return users.filter((u) => u.room === room);
}
