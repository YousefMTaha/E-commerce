export class ApiFeatures {
  constructor(mongooseQuery, data) {
    this.mongooseQuery = mongooseQuery;
    this.data = data;
  }

  pagination() {
    let { page, size } = this.data;

    if (!size || size <= 0) {
      size = 5;
    }
    if (!page || page <= 0) {
      page = 1;
    }
    const skip = size * (page - 1);
    this.data.size = size;
    this.data.page = page;
    // this.data.noPage = Math.floor(this.data.noDoc/size)
    this.mongooseQuery.skip(skip).limit(size);
    return this;
  }
  filter() {
    const exclude = ["sort", "page", "size", "searchKey", "fields"];

    const dataFilter = JSON.parse(
      JSON.stringify(this.data).replace(RegExp(/gt|lt|gte|lte/g), (match) => {
        return "$" + match;
      })
    );
    exclude.forEach((element) => {
      delete dataFilter[element];
    });
    this.mongooseQuery
    .find(dataFilter)
      .clone()
      .countDocuments()
      .then((value) => {
        this.data.noDoc = value;
      });
    return this;
  }
  sort() {
    if (this.data.sort)
      this.mongooseQuery.sort(this.data.sort.replace(RegExp(/,/g), " "));
    return this;
  }
  select() {
    if (this.data.fields)
      this.mongooseQuery.select(this.data.fields.replace(RegExp(/,/g), " "));
    return this;
  }
  search() {
    if (this.data.searchKey) {
      this.mongooseQuery.find({
        $or: [
          { name: { $regex: `${this.data.searchKey}` } },
          { description: { $regex: `${this.data.searchKey}` } },
        ],
      });
    }
    return this;
  }
}
