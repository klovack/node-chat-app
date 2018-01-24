const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Vitri',
      room: 'Masak',
    }, {
      id: '2',
      name: 'Rizki',
      room: 'Programming',
    }, {
      id: '3',
      name: 'Aji 3',
      room: 'Masak',
    }];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Rizki',
      room: 'This room',
    };
    const res = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    const removedUser = users.removeUser('1');
    expect(removedUser).toEqual({
      id: '1',
      name: 'Vitri',
      room: 'Masak',
    });
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    const removedUser = users.removeUser('1324');
    expect(removedUser).toBeUndefined();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const foundUser = users.getUser('1');
    expect(foundUser).toBe(users.users[0]);
    expect(users.users.length).toBe(3);
  });

  it('should not find user', () => {
    const foundUser = users.getUser('2352');
    expect(foundUser).toBeUndefined();
    expect(users.users.length).toBe(3);
  });

  it('should return names for masak', () => {
    const userList = users.getUserList('Masak');

    expect(userList).toEqual(['Vitri', 'Aji 3']);
  });

  it('should return names for masak', () => {
    const userList = users.getUserList('Programming');

    expect(userList).toEqual(['Rizki']);
  });
});
