export class CommentContructor {
  _id: string;

  code: string;

  componentContent: string;

  commentUserId: {
    userNickname: string;
    userImage: string;
  };

  createdAt: string;

  updatedAt: string;

  constructor(_id: string, code: string, commentUserId: {
    userNickname: string;
    userImage: string;
  }, componentContent: string, createdAt: string, updatedAt: string) {
    this._id = _id;
    this.code = code;
    this.commentUserId = commentUserId;
    this.componentContent = componentContent;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  data() {
    const reslut = {
      code: this.code,
      commentUserId: this.commentUserId,
      componentContent: this.componentContent,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
    return reslut;
  }
}