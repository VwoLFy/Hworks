import request from 'supertest';
import { app } from '../../src';

import { HTTP_Status } from '../../src/enums';
import { testing_all_dataRoute } from '../../src/routes/routes';

class HelpersForTests {
  constructor() {}

  async deleteAllData() {
    await request(app).delete(testing_all_dataRoute).expect(HTTP_Status.NO_CONTENT_204);
  }
}

export default new HelpersForTests();
